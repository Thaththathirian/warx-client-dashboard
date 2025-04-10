
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAssetStore } from '@/store/assetStore';
import { Globe, Users } from 'lucide-react';

const LatestPeersTable = () => {
  const { assetDetail } = useAssetStore();
  
  if (!assetDetail?.torrent?.latest_peers || assetDetail.torrent.latest_peers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Latest Peers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center p-6">
            <p className="text-muted-foreground">No peer data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Latest Peers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>ISP</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Last Seen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assetDetail.torrent.latest_peers.map((peer, index) => {
                const lastSeen = new Date(peer.last_seen);
                return (
                  <TableRow key={`peer-${index}`}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="mr-2 flex h-5 w-5 items-center justify-center">
                          {peer.country_code ? (
                            <img 
                              src={`https://flagcdn.com/w20/${peer.country_code.toLowerCase()}.png`} 
                              alt={peer.country} 
                              className="h-3" 
                            />
                          ) : (
                            <Globe className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <span className="block">{peer.city || 'Unknown City'}</span>
                          <span className="text-xs text-muted-foreground">{peer.country}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{peer.isp || 'Unknown ISP'}</span>
                    </TableCell>
                    <TableCell>
                      {peer.seeder ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500">
                          Seeder
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-orange-500/10 text-orange-500">
                          Leecher
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm whitespace-nowrap">
                        {lastSeen.toLocaleString(undefined, {
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LatestPeersTable;
