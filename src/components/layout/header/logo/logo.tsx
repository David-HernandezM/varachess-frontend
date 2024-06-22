import { Link } from 'react-router-dom';
import './logo.module.scss';
import LogoVaraChess from './LOGOVARACHESS_TEXT.png'
function Logo() {
  return (
    <Link to="/">
      <img style={{height: "120px"}} src={LogoVaraChess} alt="Logo Vara Chess"/>
    </Link>
  );
}

export { Logo };
