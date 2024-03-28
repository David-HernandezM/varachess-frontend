import { Route, Routes } from 'react-router-dom';
import { Home } from './home';
import { Main } from './main';
import { Profile } from './profile';
import { About } from './about';
import { Faq } from './faq';
import { Game } from './game';

const routes = [{ path: '/', Page: Home },{ path: '/main', Page: Main },
                { path: '/profile', Page: Profile },
                { path: '/about', Page: About },
                { path: '/faq', Page: Faq },
                { path: '/home', Page: Home },
                { path: '/game', Page: Game }
              ];

function Routing() {
  const getRoutes = () => routes.map(({ path, Page }) => <Route key={path} path={path} element={<Page />} />);

  return <Routes>{getRoutes()}</Routes>;
}

export { Routing };
