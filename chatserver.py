import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.template
import json

ws_clients = []

class MainHandler(tornado.web.RequestHandler):
  def get(self):
    loader = tornado.template.Loader(".")
    self.write(loader.load("index.html").generate())

class WSHandler(tornado.websocket.WebSocketHandler):
  def check_origin(self, origin):
    return True

  def open(self):
    print("connection opened")
    #Is user not in the client list already? If not add user!
    if self not in ws_clients:
      ws_clients.append(self)

  def on_message(self, message):
    parsed_json = json.loads(message)

    print("received: " + parsed_json['msg'] + " from: " + parsed_json['sender'])

    #For every websocket in our client array
    for c in ws_clients:
        #Is this a user that we need to send the message to?
        if(self != c):
            #Write the message to the client
            c.write_message(message)
        #Or is this us?
        else:
            #If so, change the sender to 'me' so we know they we sent the message ourselves
            msg = json.dumps({"msg": parsed_json['msg'], "sender": "me"}, sort_keys=False)
            c.write_message(msg)

  def on_close(self):
    print("connection closed")
    #Is user in the client list when the connection is closed? If so, remove user
    if self in ws_clients:
      ws_clients.remove(self)

application = tornado.web.Application([
  (r'/ws', WSHandler),
  (r'/', MainHandler),
  (r"/(.*)", tornado.web.StaticFileHandler, {"path": "./resources"}),
])

if __name__ == "__main__":
  #Listen on port 9090, can change to different port if you want
  application.listen(9090)
  tornado.ioloop.IOLoop.instance().start()
