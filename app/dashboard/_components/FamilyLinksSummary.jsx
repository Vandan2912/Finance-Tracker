import React from "react";

function FamilyLinksSummary({ links }) {
  return (
    <div className="border rounded-2xl p-5 my-5">
      <h2 className="font-bold text-lg mb-3">Family Links</h2>
      {links.length > 0 ? (
        links.map((link) => (
          <div key={link.id} className="mb-2">
            <span>{link.email}</span>
            <span className="text-sm text-gray-500 ml-2">({link.relationshipType})</span>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No family links yet</p>
      )}
    </div>
  );
}

export default FamilyLinksSummary;
