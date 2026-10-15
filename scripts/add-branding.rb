# Paint the Red Hawk Robotics logos onto the Option B walls in
# frc2713_shop.skp. Run it in SketchUp's Ruby console (or through the SketchUp
# MCP eval_ruby tool) after `node scripts/logo-outlines.mjs`:
#
#   $logo_json = "/path/to/garage-proposal/scripts/logo-outlines.json"
#   load "/path/to/garage-proposal/scripts/add-branding.rb"
#
# It replaces any earlier "RHR Branding" group, so it is safe to run again.
# Then export the mesh and rebuild the .glb as described in the README.
require 'json'

module RHRBranding
  FT = 12.0
  OFFSET = 0.5 # inches off the wall, to keep the paint from z-fighting
  RED = [186, 12, 47] # #BA0C2F, from the supplied logo files
  TAG = "RHR Branding"

  # Each logo: which artwork, a point in the room (feet, Option B
  # coordinates) level with the logo's centre, the direction toward the wall,
  # and the logo width in feet. The wall is found by casting a ray.
  PLACEMENTS = [
    { name: "Garage north wall", logo: "full", from: [215.7, 440, 14.27], dir: [0, 1, 0], width: 32 },
    { name: "Garage south wall", logo: "mark", from: [225.7, 420, 12.68], dir: [0, -1, 0], width: 20 },
    { name: "Fabrication cage south wall", logo: "mark", from: [195.7, 395, 10.16], dir: [0, -1, 0], width: 12 },
    { name: "Room 6 south wall", logo: "full", from: [175.5, 395, 7.93], dir: [0, -1, 0], width: 14 },
    { name: "Room 3 east wall", logo: "full", from: [240, 394.5, 7.83], dir: [1, 0, 0], width: 13 },
  ]

  def self.run(json_path)
    logos = JSON.parse(File.read(json_path))
    m = Sketchup.active_model
    host = m.entities.grep(Sketchup::Group).find { |e| e.name == "OPTION B" && e.bounds.depth > 100 }
    raise "OPTION B group not found" unless host
    to_world = host.transformation
    to_local = to_world.inverse

    m.start_operation("RHR branding", true)
    host.definition.entities.grep(Sketchup::Group).select { |e| e.name == TAG }.each(&:erase!)
    tag = m.layers[TAG] || m.layers.add(TAG)
    mat = m.materials["RHR Logo Red"] || m.materials.add("RHR Logo Red")
    mat.color = Sketchup::Color.new(*RED)

    root = host.definition.entities.add_group
    root.name = TAG
    root.layer = tag
    report = []

    PLACEMENTS.each do |pl|
      logo = logos[pl[:logo]]
      look = Geom::Vector3d.new(pl[:dir])
      across = Z_AXIS * look.reverse # the viewer's right, before fitting

      # Sample the wall across the logo's width. The end samples set its
      # direction (some walls are a fraction of a degree off square); the
      # point that sticks out most (a pilaster) sets the plane.
      hits = (0..8).map do |i|
        from = Geom::Point3d.new(pl[:from].map { |v| v * FT })
                 .offset(across, (i / 8.0 - 0.5) * pl[:width] * FT)
        hit, = m.raytest([from.transform(to_world), look.transform(to_world)], true)
        raise "No wall found for #{pl[:name]}" unless hit
        hit.transform(to_local)
      end
      right = (hits.last - hits.first).tap { |v| v.z = 0 }.normalize
      normal = right * Z_AXIS
      normal.reverse! if normal % look > 0
      right = Z_AXIS * normal
      front = hits.max_by { |p| (p - hits.first) % normal }
      mid = Geom.linear_combination(0.5, hits.first, 0.5, hits.last)
      mid = mid.offset(normal, (front - mid) % normal + OFFSET)

      # Logo axes as seen from inside the room: right is horizontal, up is Z.
      scale = pl[:width] * FT / logo["width"]
      height = logo["height"] * scale
      centre = Geom::Point3d.new(mid.x, mid.y, pl[:from][2] * FT)
      origin = centre.offset(right, -pl[:width] * FT / 2).offset(Z_AXIS, -height / 2)
      place = lambda do |(sx, sy)|
        origin.offset(right, sx * scale).offset(Z_AXIS, (logo["height"] - sy) * scale)
      end

      grp = root.entities.add_group
      grp.name = "RHR logo - #{pl[:name]}"
      grp.layer = tag
      failed = 0
      logo["shapes"].each do |loops|
        # Even-odd fill: a loop inside an odd number of others is a hole.
        holes, solids = loops.partition do |lp|
          (loops - [lp]).count { |o| Geom.point_in_polygon_2D(Geom::Point3d.new(*lp[0], 0), o.map { |p| Geom::Point3d.new(*p, 0) }, false) }.odd?
        end
        solids.each do |lp|
          f = grp.entities.add_face(lp.map(&place)) rescue nil
          failed += 1 unless f
        end
        holes.each do |lp|
          f = grp.entities.add_face(lp.map(&place)) rescue nil
          f ? f.erase! : failed += 1
        end
      end
      grp.entities.grep(Sketchup::Face).each do |f|
        f.material = mat
        f.back_material = mat
        f.reverse! if f.normal % normal < 0
      end
      grp.entities.grep(Sketchup::Edge).each { |e| e.soft = true; e.smooth = true }
      report << "#{pl[:name]}: #{pl[:width]} x #{(height / FT).round(2)} ft, " \
                "#{grp.entities.grep(Sketchup::Face).size} faces#{failed > 0 ? ", #{failed} loops failed" : ''}"
    end
    m.commit_operation
    report.join("\n")
  end
end

puts RHRBranding.run($logo_json || File.join(File.dirname(Sketchup.active_model.path), "scripts", "logo-outlines.json"))
