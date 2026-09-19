export default function MedCardSkeleton() {
  return (
    <div className="med" aria-hidden="true">
      <div className="skel" style={{ aspectRatio: '4/3', borderRadius: 0 }} />
      <div className="med-body" style={{ gap: 9 }}>
        <div className="skel" style={{ height: 9, width: '55%' }} />
        <div className="skel" style={{ height: 15, width: '85%' }} />
        <div className="skel" style={{ height: 9, width: '65%' }} />
        <div className="skel" style={{ height: 30, marginTop: 10 }} />
      </div>
    </div>
  );
}
