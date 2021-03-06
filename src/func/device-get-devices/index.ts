import { Context } from '@azure/functions';
import { Device, DeviceDto, UserRole } from '@boilerplate/entity';
import { Authorized, DB, Func } from '@boilerplate/util';

export class GetDevicesOutput {
  constructor(public devices: DeviceDto[]) {
  }
}

export async function getDevice(): Promise<GetDevicesOutput> {
  const connection = await DB.getConnection();
  const deviceRepository = connection.getRepository(Device);

  const devices = await deviceRepository.find({ relations: ['generalDevice'] });

  return new GetDevicesOutput(devices.map(DeviceDto.from));
}

export async function deviceGetDevicesFunc(context: Context) {
  context.res = await Func.run0(
    context,
    getDevice,
    Authorized.permit({
    }),
  );
}
