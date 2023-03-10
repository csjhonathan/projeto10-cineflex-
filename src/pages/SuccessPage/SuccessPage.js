import { Link } from "react-router-dom"
import styled from "styled-components"
import axios from "axios"
import { useEffect, useState } from "react"
import Loading from "../../components/Loading "
export default function SuccessPage({ order, setHome }) {
    const [success, setSuccess] = useState(false);
    const url = `https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many`;
    useEffect(() => {
        axios
            .post(url, order.reserved)
            .then(() => setSuccess(true))
            .catch(() => setSuccess(false));

        setHome(false);
    }, [])

    if (!success) {
        return (
            <PageContainer>
                <Loading />
            </PageContainer>
        )
    }
    return (
        <PageContainer>
            <h1>Pedido feito <br /> com sucesso!</h1>

            <TextContainer data-test="movie-info">
                <strong><p>Filme e sessão</p></strong>
                <p>{order.title}</p>
                <p>{`${order.sessionData} - ${order.sessionTime}`}</p>
            </TextContainer>

            <TextContainer data-test="seats-info">
                <strong><p>Ingressos</p></strong>
                {order.seatsNumber.sort((a, b) => a - b).map(seatNumber => <p key={seatNumber} >Assento {seatNumber}</p>)}
            </TextContainer>

            <TextContainer>
            <strong><p>Comprador(es)</p></strong>
                {order.reserved.compradores.map(({ nome, cpf }) => {

                    return (
                        <div data-test="client-info" key={cpf}>
                            <p>Nome: {nome}</p>
                            <p>CPF: {cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")}</p>
                        </div>
                    )
                })}
            </TextContainer>


            <Link to="/">
                <button data-test="go-home-btn">Voltar para Home</button>
            </Link>
        </PageContainer>
    )
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
    font-size: 24px;
    color: #293845;
    margin: 30px 20px;
    padding-bottom: 120px;
    padding-top: 70px;
    a {
        text-decoration: none;
    }
    button {
        margin-top: 50px;
    }
    h1 {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 700;
        font-size: 24px;
        line-height: 28px;
        display: flex;
        align-items: center;
        text-align: center;
        color: #247A6B;
    }
`
const TextContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 30px;
    strong {
        font-weight: bold;
        margin-bottom: 10px;
    }
`