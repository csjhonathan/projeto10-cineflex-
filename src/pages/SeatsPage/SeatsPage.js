import { useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import axios from "axios";
import { useState, useEffect } from "react";
import arrow from "../../assets/img/arrow.png"
import SeatReserver from "../../components/SeatReserver ";
import Loading from "../../components/Loading ";
export default function SeatsPage({ setOrder, setHome, idFilme, setSuccess }) {
    const { idSessao } = useParams();
    const url = `https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${idSessao}/seats`;
    const [session, setSession] = useState(false);
    const [selectedSeatsID, setSelectedSeatsID] = useState([]);
    const [selectedNumber, selectedSeatsNumber] = useState([]);
    const [compradores, setCompradores] = useState([]);
    const navigate = useNavigate();

    function navigateTo() {
        navigate(`/sessoes/${idFilme}`);
    }

    useEffect(() => {
        axios
            .get(url)
            .then(({ data }) => {
                setSession(data)
            })
            .catch(() => alert("erro ao fazer requisição, sinto muito, tente novamente mais tarde"));

        setHome(
            <>
                <button data-test="go-home-header-btn" onClick={navigateTo}><img src={arrow} alt="imagem de seta pra esquerda" /></button>
            </>
        )

    }, []);

    function selectColor(status) {
        if (status === "selected") {
            return { color: "#1AAE9E", border: "#0E7D71" };
        } else if (status === "available") {
            return { color: "#C3CFD9", border: "#7B8B99" };
        }
        return { color: " #FBE192", border: "#F7C52B" };
    }

    function selectSeat(seatId, status, seatNumber) {

        if (!status) {
            alert("Assento indisponível")
            return;
        };
        if (!selectedSeatsID.includes(seatId) && !selectedNumber.includes(seatNumber)) {
            const seatsID = [...selectedSeatsID, seatId];
            const seatsNumber = [...selectedNumber, seatNumber];
            setSelectedSeatsID(seatsID);
            selectedSeatsNumber(seatsNumber);
        } else {
            if (compradores.some(c => c.idAssento === seatId) && window.confirm("DESEJA REALMENTE REMOVER O ASSENTO E APAGAR OS DADOS?")) {
                const deleted = compradores.filter(c => c.idAssento !== seatId);
                setCompradores(deleted);
            }
            const removeSeat = selectedSeatsID.filter(seats => seats !== seatId);
            const RemoveSeatsNumber = selectedNumber.filter(seats => seats !== seatNumber);
            setSelectedSeatsID(removeSeat);
            selectedSeatsNumber(RemoveSeatsNumber);
            return;
        }

    }

    function finishOrder() {
        const reserve = {
            reserved: { ids: selectedSeatsID, compradores },
            title: session.movie.title,
            sessionTime: session.name,
            sessionData: session.day.date,
            seatsNumber: selectedNumber
        }
        setOrder(reserve);
        navigate(`/sucesso`);
    }

    function submitSeats(e) {
        e.preventDefault();
        if (selectedSeatsID.length === 0 || selectedNumber.length === 0) {
            alert("Selecione pelo menos um assento");
            return;
        }
        finishOrder()
    }
    if (!session) {
        return (
            <PageContainer>
                <Loading />
            </PageContainer>
        )
    }
    return (
        <PageContainer>
            Selecione o(s) assento(s)

            <SeatsContainer>
                {session.seats.map(({ id, name, isAvailable }) => {
                    return (
                        <SeatItem key={id}
                            isAvailable={isAvailable}
                            isSelected={selectedSeatsID.includes(id)}
                            onClick={() => selectSeat(id, isAvailable, name)}
                            data-test="seat"
                        >{name}</SeatItem>
                    )
                })}
            </SeatsContainer>

            <CaptionContainer>
                <CaptionItem>
                    <CaptionCircle captionColor={selectColor("selected")} />
                    Selecionado
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle captionColor={selectColor("available")} />
                    Disponível
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle captionColor={selectColor("unavailable")} />
                    Indisponível
                </CaptionItem>
            </CaptionContainer>

            <FormContainer onSubmit={submitSeats}>
                {selectedNumber.length < 1 ?
                    <SeatReserver
                        seat={selectedNumber[0]}
                        compradores={compradores}
                        setCompradores={setCompradores}
                        selectedSeatsID={selectedSeatsID}
                        selectedNumber={selectedNumber}
                    />
                    :
                    selectedNumber.map((seat) => {
                        return (
                            <SeatReserver key={seat}
                                seat={seat}
                                compradores={compradores}
                                setCompradores={setCompradores}
                                selectedSeatsID={selectedSeatsID}
                                selectedNumber={selectedNumber}
                            />

                        )
                    })

                }
                <button type="submit" data-test="book-seat-btn">Reservar Assento(s)</button>
            </FormContainer>

            <FooterContainer data-test="footer">
                <div>
                    <img src={session.movie.posterURL} alt={session.movie.title} />
                </div>
                <div>
                    <p>{session.movie.title}</p>
                    <p>{`${session.day.weekday} - ${session.name}`}</p>
                </div>
            </FooterContainer>

        </PageContainer>
    )
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
    font-size: 24px;
    text-align: center;
    color: #293845;
    margin-top: 30px;
    padding-bottom: 120px;
    padding-top: 70px;
`
const SeatsContainer = styled.div`
    width: 330px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`
const FormContainer = styled.form`
    width: calc(100vw - 40px); 
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 20px 0;
    font-size: 18px;
    button {
        align-self: center;
    }
    input {
        width: calc(100vw - 60px);
    }
`
const CaptionContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 300px;
    justify-content: space-between;
    margin: 20px;
`
const CaptionCircle = styled.div`
    border: 1px solid ${({ captionColor }) => captionColor.border};
    background-color: ${({ captionColor }) => captionColor.color};
    height: 25px;
    width: 25px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`
const CaptionItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
`
const SeatItem = styled.div`
    border: 1px solid ${({ isAvailable, isSelected }) => isSelected ? "#0E7D71" : isAvailable ? "#808F9D" : "#F7C52B"};
    background-color: ${({ isAvailable, isSelected }) => isSelected ? "#1AAE9E" : isAvailable ? "#C3CFD9" : "#FBE192"};
    height: 25px;
    width: 25px;
    border-radius: 25px;
    font-family: 'Roboto';
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`
const FooterContainer = styled.div`
    width: 100%;
    height: 120px;
    background-color: #C3CFD9;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 20px;
    position: fixed;
    bottom: 0;

    div:nth-child(1) {
        box-shadow: 0px 2px 4px 2px #0000001A;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        margin: 12px;
        img {
            width: 50px;
            height: 70px;
            padding: 8px;
        }
    }

    div:nth-child(2) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        p {
            text-align: left;
            &:nth-child(2) {
                margin-top: 10px;
            }
        }
    }
`