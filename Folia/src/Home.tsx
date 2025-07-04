import "./App.css";

interface WelcomePageProps {
  onFileSelect: () => void;
}

function Home({ onFileSelect }: WelcomePageProps) {
  return (
    <main className="container">
      <h1>Welcome to Folia</h1>
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          onFileSelect();
        }}
      >
        <button type="submit" className="icon-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px" fill="currentColor">
            <path fillRule="evenodd" d="M6,2H14L20,8V20C20,21.1,19.1,22,18,22H6C4.9,22,4,21.1,4,20V4C4,2.9,4.9,2,6,2Zm8,0L14,8H20L14,2Z" />
            <path d="M15,2 L20,7 L16,7 A 1,1 0 0 1 15,6 Z" fill="currentColor" />
          </svg>
          <span>Select Document</span>
        </button>
      </form>
      <h2>Or</h2>
      <form
        className="row"

      >
        <button type="submit" className="iconButton">

            <span>Create New</span>
        </button>
      </form>
    </main>
  );
}

export default Home;