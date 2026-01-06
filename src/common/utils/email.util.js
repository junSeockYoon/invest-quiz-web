const nodemailer = require('nodemailer');
const appConfig = require('../../config/app.config');
const logger = require('../../config/logger');

const EmailUtil = {
    sendGmail : function(params){
        const transporter = nodemailer.createTransport({            
            service: appConfig.email.service,
            port : appConfig.email.port,
            host : appConfig.email.host,
            secure : false,
            requireTLS : true,
            auth: {
              user: appConfig.email.senderId,
              pass: appConfig.email.senderPwd
            }
        });
        // 메일 옵션
        const mailOptions = {
            from: appConfig.email.from,
            to: params.receiver,
            subject: params.title,
            html: params.contents
        };
        // 메일 발송
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                logger.error(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        
    }
}

module.exports = EmailUtil;