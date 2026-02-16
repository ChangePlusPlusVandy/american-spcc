import './AdminCenter.css';

export default function AdminAnalytics() {
  return (
    <div className="admin-analytics-container">
      <h3 className="admin-panel-title">Data Analytics</h3>

      <div className="analytics-iframe-wrapper">
      <iframe
        width="600"
        height="443"
        src="https://lookerstudio.google.com/embed/reporting/5df1bdee-39f0-46eb-82fa-9ff8becf729b/page/aMnoF"
        frameBorder="0"
        style={{ border: 0 }}
        allowFullScreen
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
      </div>
    </div>
  );
}

