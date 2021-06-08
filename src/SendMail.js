const sgMail = require('@sendgrid/mail')
const sendThroughSendGrid = () => {
    // using Twilio SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: 'kafomusic@gmail.com', // Change to your recipient
        from: 'simon@btechadvisory.com', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>...and easy to do anywhere, even with Node.js</strong>',
    }
    /*
    sgMail
        .setTimeout(3000);
    */
    sgMail
        .send(msg)
        .then(() => {
            alert('Email sent');
            console.log('Email sent');
        })
        .catch((error) => {
            alert(error);
            console.error(error);
        })
}
export default sendThroughSendGrid;