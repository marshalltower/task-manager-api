const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'marshall_tower@yahoo.ca',
        subject: 'Welcome to my task app',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
        html: '<h1>Cool</h1>'
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'marshall_tower@yahoo.ca',
        subject: "We're sorry to see you go",
        text: `The account for ${name} has been deactivated upon your request. We'd love to find out how we could have done better. -Marshall`
    })
}

//could use send email with subject & body template

module.exports = {sendWelcomeEmail, sendCancellationEmail}