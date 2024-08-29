import React from 'react';
import {
    MDBInput,
    MDBContainer,
    MDBBtn,
    MDBCheckbox,
    MDBTextArea,
    MDBValidation,
    MDBValidationItem,
    MDBCard,
    MDBCol,
    MDBRow,
    MDBCardBody,
    MDBBreadcrumb,
    MDBBreadcrumbItem,
    MDBSpinner
} from 'mdb-react-ui-kit';
import { useState } from 'react';
import axios from 'axios';
import { useUserAuth } from '../store';
import Form from 'react-bootstrap/Form';
import '../css1.css';


const AddProduct = () => {

    const retrieveState = () => {
        const storedState = localStorage.getItem('userAuthState');
        console.log(storedState);
        return storedState != null ? JSON.parse(storedState) : {
            id: null,
            username: '',
            email: '',
            password: '',
            registered: '',
            address: '',
            bio: ''
        };
    }
    useUserAuth.setState(retrieveState);

    const ax1 = axios.create({
        baseURL: `${process.env.REACT_APP_BACKEND_URL}/`,
    });

    const id = useUserAuth.getState().id;

    const [visible, setVisible] = useState(false);

    const [uploaded, setUploaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const handleVisible = (event) => {
        setVisible(event.target.checked);
    }

    const [productData, setProductData] = useState({
        pName: '',
        pPrice: 0,
        pQuantity: 1,
        pType: '',
        pDetails: ''
    });

    const [selectedImage, setSelectedImage] = useState(null);

    const handleImage = (e) => {
        e.preventDefault();
        const image1 = e.target.files[0];
        const imagename1 = e.target.files[0].name;
        setSelectedImage([image1, imagename1]);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const handleChange = (field) => (e) => {
        e.preventDefault();
        setProductData({ ...productData, [field]: e.target.value });
    };

    const resetInfo = () => {
        setProductData({
            pName: '',
            pPrice: 0,
            pQuantity: 1,
            pType: '',
            pDetails: ''
        });
        setSelectedImage(null);
    }

    const update1 = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setErrMsg('');

        setIsLoading(true); // Indicate loading state

        try {
            const productDataWithId = {
                id: id,
                pName: productData.pName,
                pPrice: productData.pPrice,
                pQuantity: productData.pQuantity,
                pType: productData.pType,
                pDetails: productData.pDetails,
                pVisibility: (visible ? 1 : 0)
            };

            if (!(id && productData.pName && productData.pPrice && productData.pQuantity && productData.pType && productData.pDetails && selectedImage != null)) {
                setUploaded(false);
                setErrMsg("All fields are required");
                setIsLoading(false);
                return;
            }

            const response = await ax1.post("/api/addProduct", productDataWithId);
            if (response.status === 500) {
                resetInfo();
                setUploaded(false);
                setIsLoading(false);
                console.error("Error creating product:", response); // Handle error
            } else if (response.status === 200) {
                const createdProductId = response.data.id;
                console.log("Product created successfully:", createdProductId);

                if (!selectedImage) {
                    setUploaded(true);
                    setIsLoading(false);
                    return;
                }

                const formData1 = new FormData();
                formData1.append('my-image-file', selectedImage[0], selectedImage[1]);

                try {
                    const imageResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/image-upload`, formData1, {
                        headers: {
                            'Content-Type': 'multipart/form-data' // Set content type for image upload
                        }
                    });

                    if (imageResponse.status === 200) {
                        const imageUrl = imageResponse.data.url;
                        console.log("Image uploaded successfully:");

                        // Send image association request
                        const imageAssociationResponse = await ax1.post("/api/addImage", {
                            pId: createdProductId,
                            url1: imageUrl
                        });

                        if (imageAssociationResponse.status === 500) {
                            setUploaded(false);
                            setIsLoading(false);
                            console.error("Error associating image:", imageAssociationResponse);
                        } else if (imageAssociationResponse.status === 200) {
                            setUploaded(true);
                            setIsLoading(false);
                            console.log("Image associated successfully");
                            // Handle successful image association (e.g., reset form, display success message)
                        }
                        resetInfo();
                    } else {
                        setUploaded(false);
                        setIsLoading(false);
                        console.error("Error uploading image:", imageResponse);
                        resetInfo();
                    }
                } catch (imageUploadError) {
                    setUploaded(false);
                    setIsLoading(false);
                    console.error("Error uploading image:", imageUploadError);
                }
            }
        } catch (error) {
            setUploaded(false);
            setIsLoading(false);
            console.error("Error creating product:", error);
        }
        resetInfo();
        setIsLoading(false);
    };

    // if (isLoading) {
    //     return <p>Loading...</p>;
    // }
    if (useUserAuth.getState().id != null)
        return (
            <section>
                {isLoading && <div className='spinner-fm-back'>
                    <MDBSpinner className='m-5 spinner-fm' size="lg" role='status' color='light'>
                        <span className='visually-hidden'>Loading...</span>
                    </MDBSpinner>
                </div>}
                <MDBContainer className="py-5">
                    {/* <form onSubmit={handleSubmit}> */}
                    <MDBRow>
                        <MDBCol lg="12" className="text-center d-flex justify-content-center mb-2">
                            <MDBCard className="mb-4" data-aos="fade-up">
                                <MDBCardBody className="text-center d-flex justify-content-center mb-2 p-4">
                                    <MDBValidation isValidated>
                                        <MDBBreadcrumb className="bg-light rounded-3 p-3">
                                            <MDBBreadcrumbItem>
                                                {uploaded ? (<p className='text-success'>Request Sent Successfully!</p>) : (<p>New Product</p>)}
                                                {errMsg != '' ? (<p className='text-danger'>{errMsg} !</p>) : (<p></p>)}
                                            </MDBBreadcrumbItem>
                                        </MDBBreadcrumb>
                                        <MDBValidationItem className='mb-3 pb-1' feedback='Enter the product name.' invalid>
                                            <MDBInput
                                                label='Product Name'
                                                id='productName'
                                                placeholder='Name'
                                                onChange={handleChange('pName')}
                                                required
                                            />
                                        </MDBValidationItem>
                                        <MDBValidationItem className='mb-3 pb-1' feedback='Enter your product description.' invalid>
                                            <MDBTextArea
                                                label='Product Description'
                                                id='productDescription'
                                                placeholder='write something'
                                                onChange={handleChange('pDetails')}
                                                required
                                            />
                                        </MDBValidationItem>
                                        <MDBValidationItem className='mb-3 pb-1' feedback='Enter the product price.' invalid>
                                            <MDBInput
                                                type='number'
                                                label='Product Price'
                                                id='productPrice'
                                                placeholder='0'
                                                onChange={handleChange('pPrice')}
                                                step="0.01"
                                                required
                                            />
                                        </MDBValidationItem>
                                        <MDBValidationItem className='mb-3 pb-1' feedback='Enter the available quantity.' invalid>
                                            <MDBInput
                                                type='number'
                                                label='Available Quantity'
                                                id='availableQuantity'
                                                placeholder='1'
                                                onChange={handleChange('pQuantity')}
                                                step="1"
                                                required
                                            />
                                        </MDBValidationItem>
                                        <hr />
                                        <MDBValidationItem invalid>
                                            <Form.Select aria-label="Default select example" required onChange={handleChange('pType')}>
                                                <option value="Other" selected disabled>Select Product Type</option>
                                                <option value="Mobiles and Accessories">Mobiles and Accessories</option>
                                                <option value="Vehicles">Vehicles</option>
                                                <option value="Properties">Properties</option>
                                                <option value="Electronics and Appliances">Electronics and Appliances</option>
                                                <option value="Furniture and Decor">Furniture and Decor</option>
                                                <option value="Business and Industrial">Business and Industrial</option>
                                                <option value="Pets">Pets</option>
                                                <option value="Kids and Babies">Kids and Babies</option>
                                                <option value="Sports and Equipment">Sports and Equipment</option>
                                                <option value="Hobbies, Music, Arts, and Books">Hobbies, Music, Arts, and Books</option>
                                                <option value="Jobs">Jobs</option>
                                                <option value="Fashion and Beauty">Fashion and Beauty</option>
                                                <option value="Services">Services</option>
                                                <option value="Other">Other</option>
                                            </Form.Select>
                                        </MDBValidationItem>
                                        <label>Product Type</label>
                                        <hr />
                                        <MDBValidationItem className='mb-2 pb-1' feedback='Public Product'>
                                            <MDBCheckbox label='Publish Product' id='visibility' required onChange={handleVisible} />
                                        </MDBValidationItem>
                                        <hr />
                                        <MDBValidationItem
                                            className='mt-3 mb-5'
                                            feedback='Choose an image'
                                            invalid
                                        >
                                            <input type='file' onChange={handleImage} className='form-control' aria-label='file example' required />
                                        </MDBValidationItem>
                                        <div>
                                            <MDBBtn type='submit' onClick={update1}>
                                                Request Upload
                                            </MDBBtn>
                                        </div>
                                    </MDBValidation>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                    {/* </form> */}
                </MDBContainer>

            </section>

        ); else return (
            <p className='text-white text-center'>User Authorization Required</p>
        )
}

export default AddProduct;