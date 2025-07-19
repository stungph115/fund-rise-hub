import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Form, Row, Col } from 'react-bootstrap';
import { env } from '../../env'; // Adjust the import according to your project structure
import SpinnerGreen from '../../utils/Spinner';
import { formatDateTime } from '../../utils/utils';
import { useNavigate } from 'react-router';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fr } from 'date-fns/locale';

registerLocale('fr', fr);

function PaymentList({ client }) {
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [projectFilter, setProjectFilter] = useState('all');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchPayments();
    }, [client]);

    useEffect(() => {
        applyFilters();
    }, [payments, statusFilter, projectFilter, startDate, endDate]);

    const fetchPayments = async () => {
        try {
            const response = await axios.get(`${env.URL}payment/${client.id}`);
            setPayments(response.data);
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...payments];

        if (statusFilter !== 'all') {
            filtered = filtered.filter(payment => payment.status === statusFilter);
        }

        if (projectFilter !== 'all') {
            filtered = filtered.filter(payment => payment.invest && payment.invest.project.id === parseInt(projectFilter));
        }

        if (startDate) {
            filtered = filtered.filter(payment => new Date(payment.dateCreated) >= new Date(startDate));
        }

        if (endDate) {
            filtered = filtered.filter(payment => new Date(payment.dateCreated) <= new Date(endDate));
        }

        setFilteredPayments(filtered);
    };

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };

    const handleProjectFilterChange = (event) => {
        setProjectFilter(event.target.value);
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const uniqueProjects = [...new Map(payments.filter(payment => payment.invest).map(payment => [payment.invest.project.id, payment.invest.project])).values()];

    if (isLoading) {
        return (
            <SpinnerGreen />
        );
    }

    return (
        <div className="container">
            <Row className="mb-3">
                <Col md={3}>
                    <Form.Group controlId="statusFilter">
                        <Form.Label>Statut</Form.Label>
                        <Form.Control as="select" value={statusFilter} onChange={handleStatusFilterChange}>
                            <option value="all">Tous</option>
                            <option value="paid">Payé</option>
                            <option value="unpaid">Impayé</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group controlId="projectFilter">
                        <Form.Label>Projet</Form.Label>
                        <Form.Control as="select" value={projectFilter} onChange={handleProjectFilterChange}>
                            <option value="all">Tous</option>
                            {uniqueProjects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.title}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group controlId="startDate">
                        <Form.Label>Date de début</Form.Label>
                        <DatePicker
                            selected={startDate}
                            onChange={handleStartDateChange}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            locale="fr"
                            isClearable
                            placeholderText="Sélectionner une date"
                        />
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group controlId="endDate">
                        <Form.Label>Date de fin</Form.Label>
                        <DatePicker
                            selected={endDate}
                            onChange={handleEndDateChange}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            locale="fr"
                            isClearable
                            placeholderText="Sélectionner une date"
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Table hover>
                <thead>
                    <tr>
                        <th>Projet soutenu</th>
                        <th>Montant</th>
                        <th>Date Heure</th>
                        <th>Méthode de paiement</th>
                        {/* <th>Statut</th> */}
                    </tr>
                </thead>
                <tbody>
                    {filteredPayments.map((payment) => (
                        <tr key={payment.id}>
                            <td className={payment.invest ? 'project-in-payment-list' : ''} onClick={() => payment.invest ? navigate('/project/' + payment.invest.project.id) : null}>
                                {payment.invest ? payment.invest.project.title : 'N/A'}
                            </td>
                            <td>{payment.invest ? payment.invest.amount + ' €' : 'N/A'}</td>
                            <td>{formatDateTime(payment.dateCreated)}</td>
                            <td>{payment.paymentMethod ? payment.paymentMethod : 'N/A'}</td>
                            {/*  <td style={{ color: payment.status === 'paid' ? 'green' : 'red' }}>
                                {payment.status === 'paid' ? 'payé' : 'impayé'}
                            </td> */}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default PaymentList;
