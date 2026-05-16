import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import { BookOpen } from "lucide-react";

function ShoppingAccount() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-primary/5 border-b border-border/40 py-10 text-center">
        <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-5 h-5 text-primary/70" />
        </div>
        <h1 className="font-serif text-3xl text-foreground tracking-wide">
          Mi cuenta
        </h1>
        <p className="text-sm text-foreground/50 font-sans mt-2 tracking-widest uppercase">
          Tus pedidos y direcciones
        </p>
      </div>

      <div className="container mx-auto max-w-4xl py-8 px-4">
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <Tabs defaultValue="orders">
            <TabsList className="bg-primary/5 border border-border/30">
              <TabsTrigger
                value="orders"
                className="font-sans tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Mis pedidos
              </TabsTrigger>
              <TabsTrigger
                value="address"
                className="font-sans tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Mis direcciones
              </TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="mt-6">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address" className="mt-6">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
