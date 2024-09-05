import React from 'react';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
} from 'mdb-react-ui-kit';
import DataTable from './DataTable';
import { useAdminAuth } from '../store';


const AdminPage = () => {

    if (useAdminAuth.getState().id != null)
        return (
            <section>
                {/* style={{ backgroundColor: '#eee' }} */}
                <MDBContainer className="py-5 pt-4">
                    <h1 style={{ paddingBottom: '1.3rem', marginTop: '1.5rem' }} data-aos="fade-up">
                        <p className='text-center' style={{ color: 'blue' }}> Welcome {useAdminAuth.getState().id != null ? (useAdminAuth.getState().username) : <></>}</p>
                    </h1>
                    <form>
                        <MDBRow>
                            <MDBCol lg="12">
                                <MDBCard className="mb-4" data-aos="fade-up">
                                    <MDBCardBody>
                                        <MDBRow>
                                            <MDBCol sm="12">
                                                <MDBCardText className='text-center mb-3'>Manage Products</MDBCardText>
                                            </MDBCol>
                                        </MDBRow>
                                        <DataTable/>
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>
                        </MDBRow>
                    </form>
                </MDBContainer>
            </section>
        ); else return (
            <p className='text-white text-center'>Admin Authorization Required</p>
        )
}

export default AdminPage;