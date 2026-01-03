import SidebarVideos from './SidebarVideos';
import SidebarWeather from './SidebarWeather';
import SidebarContactCTA from './SidebarContactCTA';

const SidebarContainer = () => {
  return (
    <div>
      <SidebarVideos />
      <SidebarWeather />
      <SidebarContactCTA />
    </div>
  );
};

export default SidebarContainer;
