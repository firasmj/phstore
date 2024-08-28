import React, { useEffect, useState } from 'react';
import { MDBBtn } from 'mdb-react-ui-kit';
import { MDBDataTable } from 'mdbreact';
import axios from 'axios';

const DataTable = () => {

    const [products, setProducts] = useState([]);

    const ax1 = axios.create({
        baseURL: `${process.env.REACT_APP_BACKEND_URL}/`,
    });

    const refreshProducts = async (e) => {
        // e.preventDefault();
        await ax1.get('/products/latest')
            .then(response => setProducts(response.data))
            .then(response => console.log(response.data))
            .catch(err => console.log(err));
    }

    const refreshProductsManual = async (e) => {
        e.preventDefault();
        await ax1.get('/products/latest')
            .then(response => setProducts(response.data))
            .then(response => console.log(response.data))
            .catch(err => console.log(err));
    }

    useEffect(() => {
        ax1.get('/products/latest')
            .then(response => setProducts(response.data))
            .then(response => console.log(response.data))
            .catch(err => console.log(err));
    }, []);

    const [checkedItems, setCheckedItems] = useState([]);

    const handleCheckboxChange = (index) => (e) => {
        const isChecked = e.target.checked;
        const newCheckedItems = [...checkedItems]; // Create a copy

        if (isChecked) {
            newCheckedItems.push(index); // Add index if checked
        } else {
            const itemIndex = newCheckedItems.indexOf(index);
            if (itemIndex !== -1) {
                newCheckedItems.splice(itemIndex, 1); // Remove by index if unchecked
            }
        }

        setCheckedItems(newCheckedItems);
    };

    const acceptProducts = async (e) => {
        e.preventDefault();
        var a = Object.values(checkedItems).map(Number);
        console.log(a);
        try {
            const response = await ax1.post("/api/updateProductStatus", {
                ids: a,
                status: 'accepted'
            });
            console.log(response);
            refreshProducts();
        } catch (err) { console.log(err); }
    }

    const rejectProducts = async (e) => {
        e.preventDefault();
        var a = Object.values(checkedItems).map(Number);
        // checkedItems.forEach([index] index => a.append(index) )
        console.log(a);
        try {
            const response = await ax1.post("/api/updateProductStatus", {
                ids: a,
                status: 'rejected'
            });
            console.log(response);
            refreshProducts();
        } catch (err) { console.log(err); }
    }

    const setPending = async (e) => {
        e.preventDefault();
        var a = Object.values(checkedItems).map(Number);
        // checkedItems.forEach([index] index => a.append(index) )
        console.log(a);
        try {
            const response = await ax1.post("/api/updateProductStatus", {
                ids: a,
                status: 'pending'
            });
            console.log(response);
            refreshProducts();
        } catch (err) { console.log(err); }
    }



    const data = {
        columns: [
            {
                label: 'Select',
                field: 'select',
                sort: 'disabled',
                width: 50
            },
            { label: 'ID', field: 'id', sort: 'asc', width: 150 },
            { label: 'Name', field: 'name', sort: 'asc', width: 270 },
            { label: 'Price', field: 'price', sort: 'asc', width: 200 },
            { label: 'User ID', field: 'user_id', sort: 'asc', width: 100 },
            { label: 'Product Type', field: 'type', sort: 'asc', width: 150 },
            { label: 'Status', field: 'status', sort: 'asc', width: 100 },
            { label: 'Details', field: 'details', sort: 'asc', width: 100 },
            { label: 'Visibility', field: 'visibility', sort: 'asc', width: 100 },
            { label: 'Quantity', field: 'quantity', sort: 'asc', width: 100 }
        ],
        rows:
            products.map(product => ({
                select: (

                    <input
                        type="checkbox"
                        // checked={checkedItems.includes(product.id)}
                        entries={100}
                        value={product.id}
                        onChange={handleCheckboxChange(product.id)}
                    />
                ),
                id: product.id,
                name: product.name,
                price: product.price,
                user_id: product.user_id,
                type: product.type,
                status: product.status,
                details: product.details,
                visibility: product.visibility,
                quantity: product.quantity
            }))
    };

    return (
        <div>
            <MDBDataTable
                striped
                bordered
                small
                data={data}
                paging="false"
            />
            <form>
                <tr>
                    <td>
                        <MDBBtn onClick={acceptProducts}>Accept Products</MDBBtn>
                    </td>
                    <td>
                        <MDBBtn onClick={rejectProducts}>Reject Products</MDBBtn>
                    </td>
                    <td>
                        <MDBBtn onClick={setPending}>Set Pending</MDBBtn>
                    </td>
                    <td>
                        <MDBBtn onClick={refreshProductsManual}>Refresh</MDBBtn>
                    </td>
                </tr>
            </form>
        </div>
    );
};

export default DataTable;
