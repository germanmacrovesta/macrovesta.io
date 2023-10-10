import { type NextApiRequest, type NextApiResponse } from 'next'
import puppeteer from 'puppeteer-core'
import browserless from 'browserless'
import { prisma } from '../../server/db'
import S3 from 'aws-sdk/clients/s3'

const s3 = new S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
  signatureVersion: 'v4'
})

const GenerateCustomReport = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const name = 'Nick'

    const now = new Date()

    // const users = await prisma?.user.findMany({})
    // const venue = await prisma?.venues.findMany({
    //   where: {
    //     name: req.body.venue
    //   }
    // })
    // const streams = await prisma?.venue_Streams.findMany({
    //   where: {
    //     venue: req.body.venue
    //   }
    // })
    // const products = await prisma?.venue_Products.findMany({
    //   where: {
    //     venue: req.body.venue
    //   }
    // })
    // const deliveries = await prisma?.deliveries.findMany({
    //   where: {
    //     venue: req.body.venue
    //   }
    // })
    // const collections = await prisma?.waste_Collection.findMany({
    //   where: {
    //     venue: req.body.venue
    //   }
    // })
    // const stocks = await prisma?.stock_Check.findMany({
    //   where: {
    //     venue: req.body.venue
    //   }
    // })

    const dataObject = { templateArray: req.body.templateArray, pageIndices: req.body.pageIndices, venue: req.body.venue, timePeriod: req.body.timePeriod }

    const temp_id = await prisma?.temporary_Storage.create({
      data: {
        data: JSON.stringify(dataObject)
      }
    })

    console.log('Starting Custom Report Generator API')

    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_API_KEY}`
    })
    const page = await browser.newPage()

    const url = `https://macrovesta.ai/puppeteer-custom-report-generator?venue=${encodeURIComponent(req.body.venue)}&temp_id=${encodeURIComponent(temp_id.record_id)}`
    console.log('url', url)
    await page.goto(url, { waitUntil: 'networkidle0' }) // ensure everything's loaded

    const sleep = (milliseconds) => {
      console.log('sleeping')
      return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    await sleep(2000)

    // const renderedTemplate = CustomReport(req.body.state, req.body.pageIndices, venue, streams, products, deliveries, collections, stocks);

    // await page.setContent(renderedTemplate);

    //       <div style="width: 210mm; height: 297mm">
    //       <h1>This is the second page!</h1>
    //       <p>Here is some more text for the second page.</p>
    //       </div>

    const pdf = await page.pdf({
      format: 'A4',
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      },
      printBackground: true
    })

    await browser.close()

    // Set the response headers
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Length', pdf.length);

    // // Send the PDF
    // res.send(pdf);

    const company = req.body.venue as string
    const document = await prisma?.document.create({
      data: {
        company,
        filetype: 'pdf',
        linkedType: 'Custom Report',
        fileName: `custom_report_${now.toISOString()}`
      }
    })

    const bucketName = process.env.BUCKET_NAME
    if (typeof bucketName === 'string') {
      const params = {
        Bucket: bucketName,
        Key: `${company}/${document.id}/custom_report_${now.toISOString()}.pdf`, // File name you want to save as in S3
        Body: pdf
      }

      s3.upload(params, async function (err, data) {
        if (err) {
          console.log(err)
          res.status(500).send(err)
        } else {
          // const usersToNotify = users.filter(user => (user.company == company) || (user.company == req.body.data.organiser));
          // for (const user of usersToNotify) {
          //   let text = "";
          //   console.log("User name", user.name);

          //   if (user.company_type == "organiser") {
          //     text = `Hello ${user.name},\n\nThis is an automated message to inform you that ${company} has just received a new waste Custom Report for the collection made on ${req.body.data.collection_date}, by ${req.body.data.collector}. If you have not done so already, you should add any products, deliveries and up to date stock checks to receive accurate product capture rates.\n\nTo view your certificate, please go to the following link www.rubbishportal.com/${encodeURIComponent(req.body.data.service_provider)}/organiser/${encodeURIComponent(req.body.data.organiser)}/venues/${encodeURIComponent(company)}/tracker/certificates. You will need to be logged in to view it.\n\nShould you have any questions or concerns regarding the waste collection certificate you have received, please don't hesitate to reach out to us at support@rubbishportal.com.\n\nBest regards,\nRubbish Portal Team`;
          //   } else if (user.company_type == "venue") {
          //     text = `Hello ${user.name},\n\nThis is an automated message to inform you that ${company} has just received a new waste Custom Report for the collection made on ${req.body.data.collection_date}, by ${req.body.data.collector}. If you have not done so already, you should add any products, deliveries and up to date stock checks to receive accurate product capture rates.\n\nTo view your certificate, please go to the following link www.rubbishportal.com/${encodeURIComponent(req.body.data.service_provider)}/venue/${encodeURIComponent(company)}/tracker/certificates. You will need to be logged in to view it.\n\nShould you have any questions or concerns regarding the waste collection certificate you have received, please don't hesitate to reach out to us at support@rubbishportal.com.\n\nBest regards,\nRubbish Portal Team`;
          //   }
          //   try {
          //     await fetch(`https://${req.headers.host}/api/send-email`, {
          //       method: 'POST',
          //       body: JSON.stringify({ to: user.email, subject: "Custom Report", text: text }),
          //       headers: {
          //         'Content-Type': 'application/json'
          //       }
          //     });
          //   } catch (err) {
          //     console.log(err);
          //   }
          // }

          const urlParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: `${company}/${document.id}/custom_report_${now.toISOString()}.pdf`,
            Expires: 60 * 5,
            ResponseContentType: 'application/pdf',
            ResponseContentDisposition: 'inline'
          } // URL expires in 5 minutes
          s3.getSignedUrl('getObject', urlParams, function (err, url) {
            if (err) {
              console.log(err)
              res.status(500).send(err)
            } else {
              res.status(200).json({ reportURL: url, documentID: document.id })
            }
          })
        }
      })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' }) // If the request is not a POST request
  }
}

export default GenerateCustomReport
