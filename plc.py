

# from pycomm3 import SLCDriver
# with SLCDriver('192.168.1.5') as PLC:
#     print(PLC.read('N7:0'))
import random
import socketio
import eventlet
import csv

# global vars
pubTags = set()
list_tags = []
list_dict = {}

# TO DO : from excel or sheets
import csv

tagName = 'tag-8'

# Open the CSV file
with open('ioList.csv', 'r') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    
    for row in csv_reader:
        if row['tag'] == tagName:
            print("Found:", row)
            break  # Exit loop once found
    else:
        print("Not found")




# Create a Socket.IO server instance
io = socketio.Server(cors_allowed_origins="*")

# Create a WSGI application to run the server
app = socketio.WSGIApp(io)

@io.event
def connect(sid, environ):
    print("Client connected:", sid)
    io.emit('server_message', {'message': 'Hello from the server'}, room=sid)

# add tag dynamically
@io.on("addTag")  
def pub(sid, data):
    global pubTags
    global list_dict
    global list_tags
    ioTag = data.get("ioTag")  
    pubTags.add(ioTag)
    list_tags.append(ioTag)

    if sid in list_dict:
        list_dict[sid].append(ioTag)
    else:
        list_dict[sid] = [ioTag]    
    
@io.event
def disconnect(sid):
    global list_dict
    global list_tags
    global pubTags

    for tag in list_dict[sid]:
        list_tags.remove(tag)
        if list_tags.count(tag) == 0:
            pubTags.remove(tag)

    print(list_tags) 
    print(pubTags)   

# PLC simulator data
PLC_A = [
    {'name': 'tag1', 'val': 100},
    {'name': 'tag2', 'val': 200},
    {'name': 'tag3', 'val': 300},
    {'name': 'tag4', 'val': 400},
    {'name': 'tag5', 'val': 500},
    {'name': 'tag6', 'val': 600},
    {'name': 'tag7', 'val': 200},
    {'name': 'tag8', 'val': 400},
    {'name': 'tag9', 'val': 300}
]

PLC_D = [
    {'name': 'tag11', 'val': 0},
    {'name': 'tag12', 'val': 1},
    {'name': 'tag13', 'val': 0},
    {'name': 'tag14', 'val': 1},
    {'name': 'tag15', 'val': 0},
    {'name': 'tag16', 'val': 1},
    {'name': 'tag17', 'val': 0},
    {'name': 'tag18', 'val': 1},
    {'name': 'tag19', 'val': 0}
]

PLC_Data = PLC_A + PLC_D

if __name__ == "__main__":
    # PLC simulator
    def plc():
        global PLC_A
        global PLC_D
        resA = -1 if random.random() < 0.5 else 1
        resD = 0 if random.random() < 0.5 else 1
        for tag in PLC_A:
            tag['val'] += resA
        for tag in PLC_D:
            tag['val'] = resD

        # get from PLC and publish only the requested tags
        values = [tag['val'] for tag in PLC_Data if tag['name'] in pubTags]
        tagsList = list(pubTags)
        for val in values:
            io.emit(tagsList[values.index(val)], {'val': val})

    def interval_function():
        while True:
            plc()
            eventlet.sleep(1)  # Pause for 1 second

    eventlet.spawn(interval_function)

    eventlet.wsgi.server(eventlet.listen(("localhost", 3000)), app)
