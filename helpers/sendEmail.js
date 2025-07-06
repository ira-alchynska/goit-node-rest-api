import "dotenv/config";
import nodemailer from 'nodemailer';

const { UKR_NET_EMAIL, UKR_NET_PASSWORD, UKR_NET_HOST, UKR_NET_PORT } = process.env;

const nodemailerConfig = {
    host: UKR_NET_HOST,
    port: UKR_NET_PORT,
    secure: true,
    auth: {
        user: UKR_NET_EMAIL,
        pass: UKR_NET_PASSWORD,
    },

};

const transport = nodemailer.createTransport(nodemailerConfig);


const sendEmail = data => {
    const email = { ...data, from: `Iryna Alchynska ${UKR_NET_EMAIL}` }
    return transport.sendMail(email)
}

export default sendEmail;