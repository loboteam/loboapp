import { Button, Modal } from "@/components/min/legacygeneric";

const BoundModal: React.FC<{ children: React.ReactNode, to: boolean, triggering: ()=>void, cancel?: ()=>void }> = ({ children, to, triggering, cancel=null }) => <Modal isOpen={to} onClose={cancel? cancel: ()=>{}} title="Formulario de Confirmación">
    <div className="space-y-6">
        {children}
        <div className="flex gap-4 pt-4">
            <Button className="flex-1" onClick={triggering}>Confirmar</Button>
            {cancel && <Button variant="secondary" onClick={cancel}>Atrás</Button>}
        </div>
    </div>
</Modal>;

export default BoundModal;
//() => setIsModalOpen(false)