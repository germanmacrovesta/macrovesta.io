// components/ImportCsvForm.js
import { useState } from 'react';

export default function ImportCsvForm() {
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            alert('Please select a CSV file to import.');
            return;
        }
        const table = e.target['form'].value;
        console.log(table)

        const reader = new FileReader();
        reader.onload = async (event) => {
            const csvData = event.target?.result;

            try {
                const response = await fetch('/api/import-csv', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ csvData, table, contract: "CTZ24" }),
                });

                if (response.ok) {
                    alert('CSV data imported successfully.');
                } else {
                    const error = await response.json();
                    alert(`Error: ${error.message}`);
                }
            } catch (error) {
                console.error('Error importing CSV data:', error);
                alert('Error importing CSV data.');
            }
        };

        reader.readAsText(file);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="csvFile">Choose a CSV file:</label>
            <input
                type="file"
                id="csvFile"
                name="csvFile"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="form">Table Name</label>
            <input id="form" name="form" />
            <button type="submit">Import CSV</button>
        </form>
    );
}
