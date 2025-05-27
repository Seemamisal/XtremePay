import Login from "../components/auth/LoginForm";

export default function Home() {
  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>XtremePay Firestore Admin</h1>
     
       <hr />
      <Login />
      
    </div>
  );
}
