export const Card = ({ children }) => (
    <div className="p-4 bg-white rounded-lg shadow">{children}</div>
  );
  
  export const CardHeader = ({ children }) => (
    <div className="border-b pb-2 mb-2 font-bold text-lg">{children}</div>
  );
  
  export const CardTitle = ({ children }) => <h2>{children}</h2>;
  
  export const CardContent = ({ children }) => <div>{children}</div>;
  