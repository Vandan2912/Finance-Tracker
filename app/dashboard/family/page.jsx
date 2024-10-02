// app/components/FamilyLinkManager.jsx
"use client";
import { useState, useEffect } from "react";
import { db } from "@/utils/dbConfig";
import { familyLinks, Users } from "@/utils/schema";
import { eq, or, and } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function FamilyLinkManager() {
  const [linkRequests, setLinkRequests] = useState([]);
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [newLinkEmail, setNewLinkEmail] = useState("");
  const [newLinkRelation, setNewLinkRelation] = useState("");
  const [user, setUser] = useState(localStorage.getItem("user"));

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || {}));
  }, [localStorage.getItem("user")]);

  useEffect(() => {
    fetchLinkRequests();
    fetchLinkedAccounts();
  }, [user.id]);

  const fetchLinkRequests = async () => {
    const requests = await db
      .select({
        id: familyLinks.id,
        email: Users.email,
        relationshipType: familyLinks.relationshipType,
        status: familyLinks.status,
      })
      .from(familyLinks)
      .innerJoin(Users, eq(Users.id, familyLinks.userId))
      .where(
        and(
          eq(familyLinks.linkedUserId, user.id),
          eq(familyLinks.status, "pending")
        )
      );
    setLinkRequests(requests);
  };

  const fetchLinkedAccounts = async () => {
    const links = await db
      .select({
        id: familyLinks.id,
        email: Users.email,
        relationshipType: familyLinks.relationshipType,
      })
      .from(familyLinks)
      .innerJoin(
        Users,
        or(
          eq(Users.id, familyLinks.linkedUserId),
          eq(Users.id, familyLinks.userId)
        )
      )
      .where(
        and(
          or(
            eq(familyLinks.userId, user.id),
            eq(familyLinks.linkedUserId, user.id)
          ),
          eq(familyLinks.status, "accepted")
        )
      )
      .then((results) =>
        results.map((link) => ({
          ...link,
          email: link.email !== user.email ? link.email : null,
        }))
      );

    setLinkedAccounts(links.filter((link) => link.email !== null));
  };

  const sendLinkRequest = async () => {
    try {
      const [FamilyUser] = await db
        .select()
        .from(Users)
        .where(eq(Users.email, newLinkEmail));

      if (!FamilyUser) {
        toast.error("User not found");
        return;
      }

      await db
        .insert(familyLinks)
        .values({
          userId: user.id,
          linkedUserId: FamilyUser.id,
          relationshipType: newLinkRelation,
          status: "pending",
        })
        .then(() => {
          toast.success("Link request sent");
          setNewLinkEmail("");
          setNewLinkRelation("");
        });
    } catch (error) {
      console.error("Error sending link request:", error);
      toast.error("Failed to send link request");
    }
  };

  const respondToRequest = async (requestId, accept) => {
    try {
      await db
        .update(familyLinks)
        .set({ status: accept ? "accepted" : "rejected" })
        .where(eq(familyLinks.id, requestId));

      toast.success(accept ? "Request accepted" : "Request rejected");
      fetchLinkRequests();
      if (accept) fetchLinkedAccounts();
    } catch (error) {
      console.error("Error responding to request:", error);
      toast.error("Failed to respond to request");
    }
  };

  return (
    <div className="p-6">
      {/* <div className="h-6"></div> */}
      <div className="border p-5 rounded-2xl w-full max-w-[40vw]">
        <h2 className="font-bold text-lg">Send Link Request</h2>
        <div className="mt-2">
          <h2 className="text-black font-medium my-1">Email</h2>
          <Input
            type="email"
            placeholder="Family member's email"
            value={newLinkEmail}
            onChange={(e) => setNewLinkEmail(e.target.value)}
            className="mb-2"
          />
        </div>
        <div className="mt-2">
          <h2 className="text-black font-medium my-1">Relation</h2>
          <Input
            type="text"
            placeholder="Relationship (e.g., spouse, child)"
            value={newLinkRelation}
            onChange={(e) => setNewLinkRelation(e.target.value)}
            className="mb-2"
          />
        </div>
        <Button onClick={sendLinkRequest}>Send Request</Button>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Pending Requests</h3>
        {linkRequests.map((request) => (
          <div
            key={request.id}
            className="flex items-center justify-between mb-2"
          >
            <span>
              {request.email} ({request.relationshipType})
            </span>
            <div>
              <Button
                onClick={() => respondToRequest(request.id, true)}
                className="mr-2"
              >
                Accept
              </Button>
              <Button
                onClick={() => respondToRequest(request.id, false)}
                variant="destructive"
              >
                Reject
              </Button>
            </div>
          </div>
        ))}
        {linkRequests.length === 0 && <p>No pending requests</p>}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Linked Accounts</h3>
        {linkedAccounts.map((account) => (
          <div key={account.id} className="mb-2">
            {account.email} ({account.relationshipType})
          </div>
        ))}
        {linkedAccounts.length === 0 && <p>No linked accounts</p>}
      </div>
    </div>
  );
}
