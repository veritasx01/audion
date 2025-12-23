import { HomeButton } from './HomeButton';
import { ProfileCircle } from './ProfileCircle';
import { SearchBar } from './SearchBar';
import audionLogo from '../assets/images/audion-logo.png';

export function AppHeader() {
  return (
    <header className="app-header full">
      <div className="flex align-center">
        <img
          style={{ width: '32px', height: '32px', marginLeft: '28px' }}
          src={audionLogo}
          title="Audion"
        ></img>
      </div>
      <div className="flex row">
        <HomeButton />
        <SearchBar />
      </div>
      <div style={{ alignContent: 'center', marginRight: '0.5rem' }}>
        <ProfileCircle></ProfileCircle>
      </div>
    </header>
  );
}
