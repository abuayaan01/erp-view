import {Link} from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            Access Denied
          </CardTitle>
          <CardDescription>You do not have permission to access the requested page</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your current role does not have the necessary permissions to view this page. Please contact your
            administrator if you believe this is an error.
          </p>
        </CardContent>
        <CardFooter>
          <Link to="/" className="w-full">
            <Button className="w-full">Return to Dashboard</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

