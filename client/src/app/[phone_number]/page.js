import CallsList from "@/components/CallsList";
export default function PhoneDetails({ params }) {
  return (
   <CallsList phone_number={decodeURIComponent(params.phone_number)}/>
  );
}
