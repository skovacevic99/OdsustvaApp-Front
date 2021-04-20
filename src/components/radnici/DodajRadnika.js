import React, { Component } from 'react';
import { Col, Form, Row, Button } from 'react-bootstrap';
import TestAxios from '../../apis/TestAxios';

class DodajRadnika extends Component {

    state ={
        jmbg: "",
        imeIPrezime: "",
        email: "",
        godinaRadnogStaza: "",
        odeljenje: -1,
        odeljenja: []
    }

    componentDidMount(){
        this.getOdeljenja()
    }

    getOdeljenja(){
        TestAxios.get("/odeljenja")
            .then(res => {
                console.log(res.data)
                this.setState({
                    odeljenja: res.data
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    onInputChange(e){
        let name = e.target.name
        let value = e.target.value

        let change = {}
        change[name] = value
        this.setState(change)
    }

    proveriUnetaPolja(){
        if(this.state.jmbg != "" && this.state.imeIPrezime != "" && this.state.email != ""
             && this.state.godinaRadnogStaza != "" && this.state.odeljenje != -1){
                return true;
            } else {
                return false;
            }
    }

    dodajRadnika(){

        if(this.proveriUnetaPolja() === false){
            alert("Morate uneti sva polja!")
        } else {
            let params = {
                jmbg: this.state.jmbg,
                imeIPrezime: this.state.imeIPrezime,
                email: this.state.email,
                godinaRadnogStaza: this.state.godinaRadnogStaza,
                odeljenjeId: this.state.odeljenje
            }
            console.log(params)
    
            TestAxios.post("/radnici", params)
                .then(res => {
                    this.props.history.push("/radnici")
                })
                .catch(error => {
                    alert("Greska prilikom unosa!")
                })
        }
    }

    render() {
        return (
            <div>
                <h1 style={{textAlign: 'center'}}>Dodaj Radnika</h1>

                <Row>
                    <Col md={6}>
                        <Form>
                            <Form.Group>
                                <Form.Label>JMBG</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="text"
                                    name="jmbg"
                                    onChange={(e) => this.onInputChange(e)}>

                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Ime i prezime</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="text"
                                    name="imeIPrezime"
                                    onChange={(e) => this.onInputChange(e)}>

                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="email"
                                    name="email"
                                    onChange={(e) => this.onInputChange(e)}>

                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Godina radnog staza</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="text"
                                    name="godinaRadnogStaza"
                                    onChange={(e) => this.onInputChange(e)}>

                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Odeljenje</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="odeljenje"
                                    onChange={(e) => this.onInputChange(e)} >
                                    <option value={-1}></option>
                                    {this.state.odeljenja.map(odeljenje => {
                                        return (
                                            <option key={odeljenje.id} value={odeljenje.id} >{odeljenje.ime}</option>
                                        )
                                    })}
                                </Form.Control>
                            </Form.Group>
                        </Form>
                        <Button variant="primary" onClick={() => this.dodajRadnika()}>Dodaj</Button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default DodajRadnika;