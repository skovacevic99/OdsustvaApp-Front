import React, { Component } from 'react';
import { Table, Button, Row, Col, Form } from 'react-bootstrap';
import TestAxios from '../../apis/TestAxios';

class Radnici extends Component {

    constructor(props){
        super(props)

        let search={
            odeljenje: -1,
            jmbg: ""
        }

        this.state = {
            radnici: [],
            pageNo: 0,
            totalPages: 1,
            odeljenja: [],
            search: search
        }
    }

    componentDidMount(){
        this.getRadnici(0);
        this.getOdeljenja();
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

    getRadnici(newPageNo){

        var config = {
            params : {
                pageNo: newPageNo
            }
        }

        if(this.state.search.odeljenje != -1){
            config.params["odeljenjeId"] = this.state.search.odeljenje
        }
        if(this.state.search.jmbg != ""){
            config.params["jmbg"] = this.state.search.jmbg
        }
        console.log(config.params)

        TestAxios.get("/radnici", config)
            .then(res => {
                this.setState({
                    radnici: res.data,
                    totalPages: res.headers['total-pages'],
                    pageNo: newPageNo
                })
            })
    }

    renderTable(){
        return this.state.radnici.map(radnik => {
            return(
                <tr key={radnik.id}>
                    <td>{radnik.jmbg}</td>
                    <td>{radnik.imeIPrezime}</td>
                    <td>{radnik.email}</td>
                    <td>{radnik.brojSlobodnihDana}</td>
                    <td>{radnik.odeljenjeIme}</td>
                    <td><Button variant="primary" onClick={() => this.zakaziOdsustvo(radnik.id)} >Odsustvo</Button></td>
                    <td><Button variant="danger" onClick={() => this.obrisiRadnika(radnik.id)}>Delete</Button></td>
                </tr>
            )
        })
    }

    zakaziOdsustvo(id){
        this.props.history.push("/radnici/odsustvo/" + id);
    }

    obrisiIzState(id){
        let radnici = this.state.radnici

        for(var i in radnici){
            if(radnici[i].id == id){
                radnici.splice(i, 1)
            }
        }

        this.setState({radnici: radnici})
    }

    obrisiRadnika(id){
        TestAxios.delete("/radnici/" + id)
            .then(res => {
                console.log(res)
                this.obrisiIzState(id);
            })
            .catch(error => {
                console.log(error)
                alert("Greska prilikom brisanja!")
            })
    }

    idiNaDodaj(){
        this.props.history.push("/radnici/dodaj")
    }

    onSearchChange(e){
        let name = e.target.name
        let value = e.target.value

        let search = this.state.search
        search[name] = value
        this.setState(search)

        this.getRadnici(0);
    }

    render() {
        return (
            <div>
                <h1 style={{textAlign: 'center'}}>Radnici</h1>

                <Row>
                    <Col md={8}>
                        <Form>
                            <Form.Group>
                                <Form.Label>Odeljenje</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="odeljenje"
                                    onChange={(e) => this.onSearchChange(e)} >
                                    <option value={-1}></option>
                                    {this.state.odeljenja.map(odeljenje => {
                                        return (
                                            <option key={odeljenje.id} value={odeljenje.id} >{odeljenje.ime}</option>
                                        )
                                    })}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>JMBG</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="text"
                                    name="jmbg"
                                    onChange={(e) => this.onSearchChange(e)} >
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>

                <div style={{marginTop: '10px'}}>
                    <Button variant="primary" onClick={() => this.idiNaDodaj()}>Dodaj</Button>
                    <Button style={{float: 'right'}} disabled={this.state.pageNo == this.state.totalPages - 1} onClick={() => this.getRadnici(this.state.pageNo + 1)} variant="info">Sledeca</Button>
                    <Button style={{float: 'right'}} disabled={this.state.pageNo == 0} onClick={() => this.getRadnici(this.state.pageNo - 1)} variant="info">Prethodna</Button>
                </div>
                <Table striped bordered hover style={{marginTop: '5px'}}>
                    <thead  style={{backgroundColor: '#343a40', color: 'white'}}>
                        <tr>
                            <th>JMBG</th>
                            <th>Ime i prezime</th>
                            <th>Email</th>
                            <th>Slobodni dani</th>
                            <th>Odeljenje</th>
                            <th>Akcije</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTable()}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default Radnici;