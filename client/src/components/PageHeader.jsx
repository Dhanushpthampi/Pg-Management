import PropTypes from 'prop-types';

const PageHeader = ({ title, action }) => {
    return (
        <div className="page-header">
            <h1>{title}</h1>
            {action && <div>{action}</div>}

            <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
      `}</style>
        </div>
    );
};

PageHeader.propTypes = {
    title: PropTypes.string.isRequired,
    action: PropTypes.node,
};

export default PageHeader;
