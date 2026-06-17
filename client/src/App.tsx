import { Router, Route, Switch } from 'wouter';
import { VoiceCommands } from './components/VoiceCommands';
import { Navigation } from './components/Navigation';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Engineer from './pages/Engineer';
import AIEngineer from './pages/AIEngineer';
import School from './pages/School';
import Arcade from './pages/Arcade';
import Governance from './pages/Governance';
import Analytics from './pages/Analytics';
import Charity from './pages/Charity';
import Marketplace from './pages/Marketplace';
import Leaderboards from './pages/Leaderboards';
import Onboarding from './pages/Onboarding';
import Crypto from './pages/Crypto';
import DayTradeRoom from './pages/DayTradeRoom';
import SocialMedia from './pages/SocialMedia';
import VideoArea from './pages/VideoArea';
import EscrowShop from './pages/EscrowShop';
import Search from './pages/Search';
import NotificationsHub from './pages/NotificationsHub';
import AdminPanel from './pages/AdminPanel';
import DeveloperArea from './pages/DeveloperArea';
import CodeQualityDashboard from './pages/CodeQualityDashboard';
import SignUp from './pages/SignUp';
import ComponentShowcase from './pages/ComponentShowcase';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Router>
      <Navigation />
      <VoiceCommands />
      <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/engineer" component={Engineer} />
      <Route path="/ai-engineer" component={AIEngineer} />
      <Route path="/school" component={School} />
      <Route path="/learning" component={School} />
      <Route path="/arcade" component={Arcade} />
      <Route path="/gaming" component={Arcade} />
      <Route path="/governance" component={Governance} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/charity" component={Charity} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/leaderboard" component={Leaderboards} />
      <Route path="/leaderboards" component={Leaderboards} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/crypto" component={Crypto} />
      <Route path="/trading" component={DayTradeRoom} />
      <Route path="/daytrade" component={DayTradeRoom} />
      <Route path="/social" component={SocialMedia} />
      <Route path="/video" component={VideoArea} />
      <Route path="/escrow" component={EscrowShop} />
      <Route path="/search" component={Search} />
      <Route path="/notifications" component={NotificationsHub} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/developer" component={DeveloperArea} />
      <Route path="/code-quality" component={CodeQualityDashboard} />
      <Route path="/signup" component={SignUp} />
      <Route path="/components" component={ComponentShowcase} />
      <Route path="/profile" component={Dashboard} />
      <Route path="/videos" component={VideoArea} />
      <Route path="/:rest*" component={NotFound} />
      </Switch>
    </Router>
  );
}
