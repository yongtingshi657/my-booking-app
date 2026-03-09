import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className='notFoundDiv'>
      <h2>Page Not Found</h2>
      <Link
       to="/">
        <button>Go back to Home</button>
      </Link>
    </div>
  );
}
