const io = require('socket.io')(3000, {
    cors: {
      origin: "*",
    }
  });
  
  const cors = require('cors');
  io.use(cors());
  
  // })
  
  var admin = require('firebase-admin');
  var serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://taglinker-4ee7c.firebaseio.com',
  });
  
  let tagsD = [];
  let tagsA = [];
  
  getDTags = () => {
    return new Promise((resolve) => {
      admin
        .firestore()
        .collection('tags')
        .where("IOType", "in", ["DI", "DO"])
        .get()
        .then((snapshot) => {
          snapshot.docs.map((doc, index) => {
            tagInfo = doc.data();
            console.log(tagInfo.Name);
            if (tagInfo.Name) tagsD = [...tagsD, { name: tagInfo.Name, val: 100 }];
            // resolve('got tags');
          });
          resolve('got tags');
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }
  
  getATags = () => {
    return new Promise((resolve) => {
      admin
        .firestore()
        .collection('tags')
        .where("IOType", "in", ["AI", "AO"])
        .get()
        .then((snapshot) => {
          snapshot.docs.map((doc, index) => {
            tagInfo = doc.data();
            console.log(tagInfo.Name);
            if (tagInfo.Name) tagsA = [...tagsA, { name: tagInfo.Name, val: 100 }];
            // resolve('got tags');
          });
          resolve('got tags');
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }
  
  
  emitTags = async () => {
  
    await getDTags("DI", "DO");
    // console.log(tags);
  
    refresh1 = (res) => tagsD.map((tag) => {
      res = (Math.random() < 0.5 ? 0 : 1);
      // tag.val += res
      tag.val = res
      // console.log(`${tag.name} - ${tag.val}`);
      io.emit(tag.name, tag.val);
    });
  
    await getATags("AI", "AO");
    console.log(tagsA);
  
    refresh2 = (res) => tagsA.map((tag) => {
      res = (Math.random() < 0.5 ? -1 : 1);
      tag.val += res;
      // tag.val = res
      // console.log(`${tag.name} - ${tag.val}`);
      io.emit(tag.name, tag.val);
    });
  
  
  
    updater1 = setInterval(refresh1, 1000);
    updater2 = setInterval(refresh2, 1000);
  
  }
  
  emitTags();
  
  io.on('connection', socket => {
    console.log(socket.id)
  
    // tags = [['2400-FV-2618', 1], ['tag2', 2], ['tag3', 3], ['tag4', 4]]
  
    // tags.map((tag) => {
  
    //   socket.emit(tag[0], tag[1])
    // })
  })