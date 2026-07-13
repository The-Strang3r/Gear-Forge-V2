@media (max-width: 768px) {
  #theme-toggle {
    position: static;
    margin-bottom: 20px;
    padding: 6px 12px;
    font-size: 12px;
  }

  .armor-grid { grid-template-columns: 1fr !important; }

  .armor-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .dropdown-group {
    width: 100%;
    flex-direction: column;
  }

  select { width: 100%; }

  .footer {
    position: static;
    margin-top: 20px;
    text-align: center;
    opacity: 0.7;
    font-size: 10px;
  }

  body { overflow-x: hidden; }
}

/* Small screen: receipt goes below + stretches */
@media (max-width: 900px) {
  .main-layout {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .left-col { order: 1; }
  .right-col { order: 2; }

  .xp-summary {
    position: static;
    width: 100%;
  }
}
