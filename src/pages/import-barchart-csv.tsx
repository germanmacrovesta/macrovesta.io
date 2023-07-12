import Head from "next/head";
import { TVChartContainer } from "../components/TVChartContainer";
import {
    ChartingLibraryWidgetOptions,
    ResolutionString,
} from "../../public/static/charting_library/charting_library";
import ImportCsvForm from '../components/importCSVForm';
import React from 'react'

// const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
//     symbol: "AAPL",
//     interval: "1D" as ResolutionString,
//     library_path: "/static/charting_library/",
//     locale: "en",
//     charts_storage_url: "https://saveload.tradingview.com",
//     charts_storage_api_version: "1.1",
//     client_id: "tradingview.com",
//     user_id: "public_user_id",
//     fullscreen: false,
//     autosize: true,
// };

export default function GraphPage() {
    const [file, setFile] = React.useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            alert('Please select a CSV file to import.');
            return;
        }
        // const table = e.target['form'].value;
        // console.log(table)

        const reader = new FileReader();
        reader.onload = async (event) => {
            const csvData = event.target?.result;

            try {
                const response = await fetch('/api/import-barchart-csv', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ csvData, table: "cotton_contracts" }),
                });

                // if (response.ok) {
                //     alert('CSV data imported successfully.');
                // } else {
                //     const error = await response.json();
                //     alert(`Error: ${error.message}`);
                // }
            } catch (error) {
                console.error('Error importing CSV data:', error);
                alert('Error importing CSV data.');
            }
        };

        reader.readAsText(file);
    };
    return (
        <>
            <Head>
                <title>TradingView Charting Library and Next.js</title>
                <script src="/static/datafeeds/udf/dist/bundle.js" async />
            </Head>
            <main>
                {/* <TVChartContainer {...defaultWidgetProps} /> */}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="csvFile">Choose a CSV file:</label>
                    <input
                        type="file"
                        id="csvFile"
                        name="csvFile"
                        accept=".csv"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    {/* <label htmlFor="form">Table Name</label>
                    <input id="form" name="form" /> */}
                    <button type="submit">Import CSV</button>
                </form>
            </main>
        </>
    );
}

