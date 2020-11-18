import firestore from '../config/fbconfig';
import * as firebase from 'firebase';

// async function get() {
//   var rows= [];
//   await firestore.collection('question').get()
//     .then((snapshot)=>{
//       // var rows= [];
//       snapshot.forEach((doc) => {
//         const question = doc.data();
        
//         const id = doc.id;
//         rows.push({id : id, ...question});
//       })
//     });

//   return rows;
//   }


export const actionName = actionParameter => ({
    type: 'ACTION_TYPE',
    actionParameter
})

