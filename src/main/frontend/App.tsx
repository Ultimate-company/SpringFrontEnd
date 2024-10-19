import router from './routes';
import { RouterProvider } from 'react-router-dom';
import { ConfirmProvider } from "material-ui-confirm";

export default function App() {
  return (
      <ConfirmProvider>
        <RouterProvider router={router} />
      </ConfirmProvider>
  );
}