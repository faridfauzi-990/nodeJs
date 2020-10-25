const express = require('express');
const app = express();
const port = 8000;
const postsData = require("./posts.json");
const commentsData = require("./comments.json");

function renameFunction (parameter) {

    if (parameter && parameter[0] && parameter[0].postId) {
        /* this is comments */
        parameter = parameter.map(elm => ({ post_id: elm.postId, id: elm.id, post_name: elm.name, post_email: elm.email, post_body: elm.body }));
    }
    if (parameter && parameter[0] && parameter[0].userId) {
        /* this is posts */
        parameter = parameter.map(elm => ({ post_userId: elm.userId, post_id: elm.id, post_title: elm.title, post_body: elm.body }));
    }

    return parameter;
}

app.get('/comments', (request, response) => {

    const resultArray = renameFunction(commentsData);

    let tempOutput = {
        total_number_of_comments: resultArray.length,
        outputData: resultArray
    };
    response.json(tempOutput);
});

app.get('/comments-with-param', (request, response) => {
    // http://localhost:8000/comments?id=2&email=Nikita@garfield.biz

    // console.log('----starts---');
    // console.log('comments: ', request.query);

    var postId = request.query.postId;
    var id = request.query.id;
    var name = request.query.name;
    var email = request.query.email;

    let getComments = [];
    if (email) {
        getComments.push(commentsData.find((account) => account.email === email));
    }
    if (id) {
        getComments.push(commentsData.find((account) => parseInt(account.id) === parseInt(id)));
    }
    if (postId) {
        getComments.push(commentsData.find((account) => parseInt(account.postId) === parseInt(postId)));
    }
    if (name) {
        getComments.push(commentsData.find((account) => account.name === name));
    }

    const resultArray = renameFunction(getComments);

    let tempOutput = {
        total_number_of_comments: resultArray.length,
        outputData: resultArray
    };
    // console.log('----ends---');
    response.json(tempOutput);
});


app.get('/posts', (request, response) => {

    // const resultArray = postsData.map(elm => ({ post_id: elm.id, post_title: elm.title, post_body: elm.body }));
    const resultArray = renameFunction(postsData);

    let tempOutput = {
        total_number_of_comments: resultArray.length,
        outputData: resultArray
    };
    response.json(tempOutput);
});


app.get('/posts/:id', (request, response) => {
    const accountId = Number(request.params.id);
    let getPostData = postsData.find((account) => account.id === accountId);

    if (!getPostData) {
        response.status(500).send('Id not found.');
    } else {

        const resultArray = renameFunction(getPostData);

        let tempOutput = {
            total_number_of_comments: resultArray.length,
            outputData: resultArray
        };
        response.json(tempOutput);
    }
});


app.listen(port, () => {
    console.log(`Example app listening on port ${ port }!`);
});
