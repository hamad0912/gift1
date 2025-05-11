// ملف: api/webhook.js

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SHEET_ID = '16y2yhu6rHQ2hTVdjzYgoNjr5XNm1eEKVJzPZAQ7YCcc';
const SERVICE_ACCOUNT_EMAIL = 'salla-291@salla-459501.iam.gserviceaccount.com';
const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCkdbl8ogEPShFB\nEPijWVFEsCFpX+WJRmhXWlFyIuBMpxsPzVUnfR+Ma6PH1UMrOH6Uz5uTC2xQ8pAZ\ngJt06Vw7Xv9yuuKtDoanRGjvL/NgVeGuDpvAHPqpjHGWlC2RlgaB2JxilfD9wR6q\nLdx09u0CLitnYvrzmNcnSdgjuNNEr/iTOV0HgohiZS7hFg0UvJFkvM8hDKZyFVBz\nrRC8ansHHnxn+DDrIr61+cR4rzt8FFrRDbOKzfB42vjFW91uJHeKCEjAQOj+ECXM\nOTMan6O6QPfk+IXLFMOYI39VI7lglK3eVVmAvtgThcETPR652w/nWcMGhXqfUDW8\ny+UQnMt5AgMBAAECggEAC/06aM0/+dxdcPqKwGXKLea6g3273wu59DxKWba/K/dh\nWqqOaFLlJ43P98kinMEBQVn32SVpCmb/KEzJiHaxWZwC+rCIcTNGOmVwp5c9on/q\n9DnDvaKfMhhh+NHpQdwdB1RCOlGnVZMW6DMbB4/aFrbvmm7gepJhhPoLfrcs96x6\ne8gvlYsflmKzV4UuiH3UZHqh0+JsRoWp0UqfKXNReJvEvNrHiwuVIPICkNpCz/YU\nAJDNZaSDcHrKhxx1pQSafUsO8utdcG5Pu6TTDzitFQQ6UFkWrFKQtrrjBrV0Crgh\nNwl6rcnQU9JDwllpGpUBWrjza8MSTojiCckCXwFncQKBgQDWpx7Q0sSJ56WKZHyJ\nxaQaACDYUAfQv9KPxapmEW2pm2V+IcFkAPPdr3OvOdeTzqJmtdFdJUMU7EiDbdck\nNk489vDKjDQzvsUA/k+3bbap0nBwmjU91urwRThrwKTppWqcPiXiGCpWuikE/KiL\nx032mYpkuDXCbDUywYBMvYmWVQKBgQDEI4IMusSdCfo5E9FKIsyLxgn9E2mGnH3a\nnbvFOSJrXh4e8bRSwXiwTvXGgRRvh2Oz2BtsAJj2m9SvpR/pc98vhjPcZx1sp1i1\nkbV4YvZbCBcmi2XLzHIkahHLSHQpb+Ouwb6Z1HgZqxj+NkY60oC+FczAxT0NHQ4V\n3ElIV7sclQKBgQCjv4uvjAnolfFf+LZUt5QvTYfA3JSJt7ved9E82fDJYUV0ijWo\nn11p8S2UL9D37btQFUWpBAL/lBzhPkrQUikvMsaQDZLJIq/QyTBw4t5lAKdMDyes\njCZfsr6O3MAxiUIh/PsTVpH95TfjmQbO0vTzuT+tBCXmsnuGw7ynTjQGnQKBgQDD\n6IOZm2OPR8v6/uRpHGEaq3CGq8EXh2/d0Pcgg3TxsUx8tAfdMQoPcI7k+0EiNSVN\nGWoqcl5W1EeYOWKql+YxXeanGwe042Ij2apc2NwhCO+2vD2tVkQcQyYK2g/M48mT\nYEm09RgQ62lHYYa8ck3Nj5C4a0oTsxXCmAlKjPaEEQKBgHdaBxGA4kmm85bOneLV\ndUGXC3106vodSnWlhAzgF3T7b8oEzGDuhufmNpz9OK0hYJwigM5QLuD04+6E/Xv9\ncMO2Z7XPaGR/0DFf6OkFai00x7YvXKFa6M6hOaRHcVq5Hg+ViuMQ1NbKYoJ5/KvA\nvzmXQVDB80ae9JazIM9XdhDq\n-----END PRIVATE KEY-----\n`.replace(/\\n/g, '\n');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { store_url, discount_code } = req.body;

        if (!store_url || !discount_code) {
            return res.status(400).json({ message: 'Missing data' });
        }

        const auth = new JWT({
            email: SERVICE_ACCOUNT_EMAIL,
            key: PRIVATE_KEY,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(SHEET_ID, auth);
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];

        await sheet.addRow({ store_url, discount_code });

        res.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}