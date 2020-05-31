const sgMail = require('@sendgrid/mail');
// const sendgridApiKey = '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';
// sgMail.setApiKey(sendgridApiKey);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// sgMail.send({
//     to:'smrhrbi@gmail.com',
//     from: 'smrhrbi@gmail.com',
//     subject: 'This my first mail',
//     text: 'I hope it work'
// });

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'smrhrbi@gmail.com',
        subject: 'Thanks for Joining in',
        text: `Welcome to My Budget App, ${name}, Please let me know how you get along with the app.`
    })
}

module.exports = {
    sendWelcomeEmail
}