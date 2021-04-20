import React, { Component } from 'react';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';
import TestAxios from '../../apis/TestAxios';

class Odsustvo extends Component {

    state = {
        radnik: {},
        dana: 1,
        datum: ""
    }

    componentDidMount(){
        this.getRadnik()
    }

    getRadnik(){
        let id = this.props.match.params.id

        TestAxios.get("/radnici/" + id)
            .then(res => {
                console.log(res.data)
                this.setState({radnik: res.data})
            })
            .catch(error => {
                alert("Doslo je do greske.")
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

    popunjenaPolja(){
        if(this.state.dana > 0 && this.state.datum != ""){
            return true;
        } else {
            return false;
        }
    }

    zakazi(){
        if(this.popunjenaPolja() === false){
            alert("Morate popuniti sva polja!")
        } else {
            let params = {
                datumPocetka: this.state.datum,
                randnihDana: this.state.dana,
                radnikId: this.state.radnik.id
            }
            console.log(params)

            TestAxios.post("/odsustva", params)
                .then(res => {
                    this.props.history.push("/radnici")
                })
                .catch(error => {
                    alert("Greska. Zakazali ste vise slobodnih dana nego sto imate.")
                    console.log(error)
                })
        }
    }

    renderForm(){
        return(
            <Row>
                <Col md={6}>
                    <Form>
                        <Form.Group>
                            <Form.Label>Datum Pocetka</Form.Label>
                            <Form.Control
                                as="input"
                                type="text"
                                name="datum"
                                placeholder = "2020-01-30"
                                onChange={(e) => this.onInputChange(e)}>

                            </Form.Control>
                        </Form.Group>
                    </Form>
                    <Form>
                        <Form.Group>
                            <Form.Label>Radnih dana</Form.Label>
                            <Form.Control
                                as="input"
                                type="number"
                                value={this.state.dana}
                                name="dana"
                                onChange={(e) => this.onInputChange(e)}>

                            </Form.Control>
                        </Form.Group>
                    </Form>
                    <Button variant="primary" onClick={() => this.zakazi()}>Zakazi</Button>
                </Col>
            </Row>
        )
    }

    render() {
        return (
            <div>
                <h1 style={{textAlign: 'center'}}>Zakazivanje odsustva</h1>

                {this.state.radnik.brojSlobodnihDana == 0? <div><h2>Iskorišteni su svi slobodni dani.</h2></div> : this.renderForm()}
            </div>
        );
    }
}

export default Odsustvo;