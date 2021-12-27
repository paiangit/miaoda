import { useParams } from 'react-router-dom';

function Project() {
  const params = useParams();
  return (
    <div className="project" >
      project {params.id}
    </div>
  );
}

export default Project;
