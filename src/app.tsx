import "@gear-js/vara-ui/dist/style.css";
import { useAccount, useApi } from "@gear-js/react-hooks";
import { ApiLoader } from "@/components";
import { Header } from "@/components/layout";
import { withProviders } from "@/app/hocs";
import { useWalletSync } from "@/features/wallet/hooks";
import { Home } from "./pages/home";
import { Box , HStack, Center} from "@chakra-ui/react";
import './App.css';

function Component() {
  const { isApiReady } = useApi();
  const { isAccountReady } = useAccount();

  useWalletSync();

  const isAppReady = isApiReady && isAccountReady;

  return (
    <>
      <Header isAccountVisible={isAccountReady}/>
      {isAppReady ? 
      
        <Center> 
      <div  className="middlebox">
      <Home  /> 
      </div>
      </Center>
     
      : <ApiLoader />}
      </>
  );
}

export const App = withProviders(Component);
