import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';
import { ListGroup } from 'react-bootstrap';

function Square(props) {
  return (
    <Col md={1} className="p-0 text-center border">
      <Button className="btn p-0 w-100 h-100" variant="light" onClick={props.onClick}>
        {props.value}
      </Button>
    </Col>
  )
}

function SubTitle(props) {
  return (
    <Col md={1} className="p-0 border">
      <h5 className="mb-0 h-100 text-center">
        {props.value}
      </h5>
    </Col>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderSubTitle(char) {
    return (
      <SubTitle
        value={char}
      />
    );
  }

  render() {
    return (
      <Container className="p-5 border rounded">
        <Row className="justify-content-center line-game">
          {this.renderSubTitle('')}
          {this.renderSubTitle('A')}
          {this.renderSubTitle('B')}
          {this.renderSubTitle('C')}
        </Row>
        <Row className="justify-content-center line-game">
          {this.renderSubTitle(1)}
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </Row>
        <Row className="justify-content-center line-game">
          {this.renderSubTitle(2)}
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </Row>
        <Row className="justify-content-center line-game">
          {this.renderSubTitle(3)}
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </Row>
      </Container>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) == 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((ste, move) => {
      const [desc, button_desc] = move ?
        [ "Voltar para #" + move, "Voltar" ] :
        [ "Iniciar jogo novamente!", "Iniciar" ];

      return (
        <ListGroup.Item as="li" className="py-1" key={move}>
          <Button
            variant="outline-info"
            onClick={() => this.jumpTo(move)}
          >
            {button_desc}
          </Button>
          <span> {desc}</span>
        </ListGroup.Item>
      );
    });

    let status;
    if (winner) {
      status = "Vencedor: " + winner;
    } else {
      status = 'Próximo jogador: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <Container fluid className="py-5">
        <Row className="pb-5 my-5">
          <Col md={12}>
            <h2 className="text-center text-primary font-weight-bold">Bem Vindo ao Tic Tac Toe (Jogo da Velha)</h2>
            <h2 className="text-center mb-0 text-success">Divirta-se !</h2>
          </Col>
        </Row>
        <Board
          squares={current.squares}
          onClick={(i) => this.handleClick(i)}
        />
        <Row className="my-3 py-3 justify-content-center">
          <Col md={12}>
            <h4 className="text-center">{status}</h4>
          </Col>
          <Col md={4} className="mt-3">
            <ListGroup as="ol">{moves}</ListGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}