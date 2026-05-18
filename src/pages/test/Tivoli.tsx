import { useIdentityToken } from "../../hooks/useIdentityToken";

export default function TestTivoli() {

  // EXAMPLE TEST URL-QUERY-STRING
  //http://localhost:5173/test/tivoli/?identity_token=fake-test-123

  const token = useIdentityToken();

  return (
    <div>
      <h1>TestTivoli</h1>

      {/* DISPLAY TOKEN FROM QUERY-STRING IF VISITS TEST-URL */}
      <h2>{token}</h2>

    </div>
  );
}
