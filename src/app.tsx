import "@gear-js/vara-ui/dist/style.css";
import { useAccount, useApi } from "@gear-js/react-hooks";
import { ApiLoader } from "@/components";
import { Header } from "@/components/layout";
import { withProviders } from "@/app/hocs";
import { useWalletSync } from "@/features/wallet/hooks";
import { Home } from "./pages/home";
import { Box , HStack, Center} from "@chakra-ui/react";

import { useContext, useEffect } from "react";
import { dAppContext } from "./context/dappContext";
import { useAppDispatch } from "./app/hooks";
import { 
  polkadotAccountIsEnable,
  gearApiStarted,
  apiIsDisconnected,
  apiIsBusy,
  setGaslessActive,
  setShowGaslessSwitch
} from "./app/SliceReducers"; 

import './App.css';

function Component() {
  const { isApiReady } = useApi();
  const { account, isAccountReady } = useAccount();
  const { setSignlessAccount } = useContext(dAppContext);
  const dispatch = useAppDispatch();

  useWalletSync();

  const isAppReady = isApiReady && isAccountReady;


  useEffect(() => {
    if (account) {
      dispatch(polkadotAccountIsEnable(true));
      dispatch(setShowGaslessSwitch(true));
    } else {
      dispatch(polkadotAccountIsEnable(false));
      dispatch(setShowGaslessSwitch(false));
    }

    if (setSignlessAccount) setSignlessAccount(null);
    dispatch(setGaslessActive(false));
  }, [account]);

  useEffect(() => {
    if (isApiReady) {
      dispatch(apiIsDisconnected(false));
    } else {
      dispatch(apiIsDisconnected(true));
    }

    dispatch(gearApiStarted(isApiReady));
  }, [isApiReady]);

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
