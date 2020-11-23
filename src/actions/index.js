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

export const getQuestionList = questionList => {
  questionList = questionList || 0;
  return (dispatch, getState) => {
    firestore.collection('question').get()
    .then((snapshot)=>{
      var rows= [];
      // console.log("snapshot ", snapshot );
      snapshot.forEach((doc) => {
        const question = doc.data();
        
        const id = doc.id;
        // question.id = id;
        console.log({id : id, ...question});
        question["createdAt"] = question["createdAt"].toDate();
        if (question["comments"]){
          question["comments"].forEach(comment => {
            comment["metadata"] = comment["metadata"].toDate();
          })
        }

        rows.push({id : id, ...question});
      })
      console.log(rows);
      questionList = rows;
      dispatch({type: 'GET_QUESTION_LIST', questionList})
    });
  }
}


export const actionName = actionParameter => ({
    type: 'ACTION_TYPE',
    actionParameter
})

