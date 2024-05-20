import { Link } from 'react-router-dom';
import './logo.module.scss';
import LogoVaraChess from './LOGOVARACHESS.png'
function Logo() {
  return (
    <Link to="/">
      <img style={{height: "80px"}} src={LogoVaraChess} alt="Logo Vara Chess"/>
    </Link>
  );
}

export { Logo };
